# At the time these experiments were run (Jan 2024) the latest Empirica release 
# had several bugs. Data stored in the database (tajriba.json) file was dropped 
# by the `empirica export` command, making it impossible to match audio files or 
# transcriptions to the relevant trials. 

# I therefore wrote custom jquery command to extract additional fields from the 
# database, and a short custom script to query the 100ms API (to get audio file 
# identifiers and map them to the player identifiers). 

# I have documented the steps I took to get those custom files in the repo, but
# I think the latest release of empirica may have already fixed this problem. 
# I hope the following will not be useful to anybody, as I do not recommend this approach. 


# This script collates data from the following sources: 
# - Rounds.csv files: produced by `empirica export`, and include 
#   participant ID and trial information (conditions for each trial)

# - games.csv files: produced by `empirica export`, and include 
#   the game ID (assigned by empirica) and audio room ID (used to identify audio)

# - playerRoles.csv files: Maps from player ID to their role (director or guessor)
#   produced by a custom jquery command called on (tajriba, the database file)

# - peerIDpeerName.csv files: 
#   Map from (empirica) player ID to the audio peer ID, sessionID, and roomID
#   These files were generated by querying the 100ms API 

# - transcription.csv file: 
#   Human-coded transcriptions for each trial. 

# - surprisals.csv file: 
#   Surprisal of each utterance found in the transcription.csv file. 

# - norming data: 
#   Results of norming study on stimuli 

library(tidyverse)
library(here)

# Step 1: Get trial data with rounds.csv files 
# Read all rounds.csv files
file_list <- list.files(
  path = "../../data/03_interactiveSprayLoad/data-collection-phase", # directory to search within
  pattern = "rounds.csv$", 
  recursive = TRUE,          # searches subdirectories
  full.names = TRUE          # returns the full path
)

# Some batches have been exported more than once. Get a list with one rounds.csv 
# file from each batch 
file_list_deduplicated <- file_list[!grepl("exportRemote", file_list)]

# read all the matching files
lst.trial_data <- lapply(file_list_deduplicated, read_csv)  

df.trial_data <- do.call("rbind", lst.trial_data) %>% 
  select(index, gameID, 
         verb, target_loc, target_sub, 
         informativityCondition, foreCondition, 
         mirroringCondition,
         distractor1, distractor0, distractor_locs, distractor_subs,
         decision,   directorOrder, guesserOrder)  %>%
  #gets only production trials
  filter(index > 49) %>% 
  # Each round has a duplicate row (caused by the way feedback stage of each trail 
  # Is coded in Empirica- remove duplicates): 
  distinct(.keep_all = TRUE) 

# Sanity check: total of 94 games, each with 36 trials
df.trial_data %>% group_by(gameID) %>% summarize(c = n())
df.trial_data %>% group_by(gameID) %>% summarize() %>% count()


# Do some string cleaning 
df.trial_data %>% mutate(
  distractor_subs = gsub("\\[|\\]|\"", '', df.trial_data$distractor_subs),
  distractor_locs = gsub("\\[|\\]|\"", '', df.trial_data$distractor_locs),
  distractor0 = gsub("\\[|\\]|\"", '', df.trial_data$distractor0),
  distractor1 = gsub("\\[|\\]|\"", '', df.trial_data$distractor1)) %>% 
  rename(targetLocation = target_loc, 
         targetSubstance = target_sub, 
         distractorLocations = distractor_locs, 
         distractorSubstances = distractor_subs)


# Step 2: get a tibble with gameIDs and associated audio roomIDs
# Read in games.csv files 
gamesFiles_list <- list.files(
  path = "../../data/03_interactiveSprayLoad/data-collection-phase",  
  pattern = "games.csv$", 
  recursive = TRUE,          # searches subdirectories
  full.names = TRUE          # returns the full path
)

# Remove duplicate files: 
gamesFiles_list_deduplicated <- gamesFiles_list[!grepl("exportRemote", gamesFiles_list)]
gamesData_lst = lapply(gamesFiles_list_deduplicated, read_csv)  # read all the matching files

raw_games_data <- do.call("rbind", gamesData_lst)

games_to_rooms <- raw_games_data %>% 
  select(id, roomID) %>%
  rename(gameID = id)

## Add gameID to the main dataframe
df.trial_data <- left_join(df.trial_data, 
                              games_to_rooms, 
                              by = join_by(gameID),
                              relationship = "many-to-one")

# Step 3: Identify Director Participants
directors_firstHalf <- read_csv("../../data/03_interactiveSprayLoad/data-collection-phase/playerRoles-batch1-14.csv") %>%
  filter(role == 'director') %>% 
  select(-batch)
directors_secondHalf <-  read_csv("../../data/03_interactiveSprayLoad/data-collection-phase/playerRoles-batch15-18.csv") %>%
  filter(role == 'director') 
directors <- rbind(directors_firstHalf, directors_secondHalf)

# Step 4: Identify peer IDs of the directors (to find their audio)
## Now read in the CSV that maps from room ID to peer ID, and filter to get just directors
peer_to_room <- read_csv("../../data/03_interactiveSprayLoad/data-collection-phase/peerIDpeerName-batch1-18.csv") %>%
  mutate(roomID = room_id) %>%
  filter(peer_name %in% directors$ID)

# Step 5: Remove buggy participants 

# Find and remove people with multiple peer IDs: all of these except one had severe 
# Connection issues. In one case, the audio is ok 65a9b6d6517d71d91b152c94 
# But there's too many track files for the director to transcribe. 
# Leaves 73 audio files 
multi_peer_id <- peer_to_room %>% 
  group_by(roomID) %>% 
  summarize(c = n()) %>% 
  filter(c >1)
buggy_audio <- peer_to_room %>% 
  filter(roomID %in% multi_peer_id$roomID) %>% 
  select(roomID) %>% c()
peer_to_room <- peer_to_room %>% 
  filter(!(roomID %in% buggy_audio$roomID))

# Left join drops peers which we don't have trial data for
df.trial_data <- left_join(df.trial_data, peer_to_room) 

# Filter non-native speakers, entirely silent submissions, etc
df.trial_data %>% 
  filter(peer_name != '01HM9CR96TM9Z0J774P3CHHP9Z') %>% #NNS
  filter(peer_name != '01HMFFF55WVG7MNF6660MH5SGX') %>% # NNS, missed many trials
  filter(peer_name != '01HMEJZPBQXJF57QHDQP7R7VKH') %>% # NNS, not doing task
  filter(peer_name != '01HM97Z6TW6D2WHKM33JEASA31') %>% # NNS/ non standard accent? 
  filter(peer_name != '01HMH1B5F7NPCHS5S47GAJBS7M') %>% # NNS/ non standard accent?
  filter(peer_name != '01HMEE8SWG6FGQFEBVPWAMZMPA') %>% # Silence 
  filter(peer_name != '01HMEJX8CXQ4R9TD53BJA1REG9') %>% # Not complete dyad
  filter(peer_name != '01HMFBV8ZBS5R5VBW9ATTFR1XS') %>% # Not complete dyad
  filter(peer_name != '01HMH1GWBW5YMZMZ483ETNCFNE')     # Not complete dyad

# Step 6: Add Transcription to each trial 

transcriptions_batch1_15 <- read_csv("../../data/03_interactiveSprayLoad/data-collection-phase/all_transcriptions_batch1-15.csv") %>%
  select(-idx)
transcriptions_batch15_18 <- read_csv("../../data/03_interactiveSprayLoad/data-collection-phase/all_transcriptions_batch15-18.csv")

transcriptions <- rbind(transcriptions_batch15_18, transcriptions_batch1_15) %>%
  mutate(index = trialIndex + 49) %>%
  filter(index%%1 == 0) %>% # coded chit-chat for the first 15 batches 
  mutate(peer_name = player_name) %>% 
  select(-peer_id, -verb)

## and again, join it to the bigger data set (mapping with peerID this time)
# Left join will drop transcriptions from files that have been removed from 
# df.trial_data (NNS, non-task doers)
df.trial_data <- left_join(df.trial_data, 
                           transcriptions, 
                           by = join_by(index, peer_name)) %>% 
  filter(first_noun == 'loc' | first_noun == 'sub') %>%
  mutate(item = paste(target_sub, target_loc, sep = "")) %>%
  select(gameID, peer_name, index, verb, item, first_noun,
         informativityCondition, foreCondition, mirroringCondition, 
         text) 


# Resulting data frame has 63 games, 
# With an average of 27.11 trials per game with usable transcription 
# Range from 14 to 32 (32 is the max since we didn't code fillers)
df.trial_data %>% group_by(gameID) %>% 
  summarize(c = n())

df.trial_data %>% group_by(gameID) %>% 
  summarize(c = n()) %>%
  summarize(min_Number_trials = min(c), max = max(c), mean = mean(c))


## Step 7: Add the norming data: participants rate stimuli for the affectedness
# of each location object 

df.raw_norms <- read_csv(here("data", 
                         "02_normingAvailabilityStims", 
                         "normingAvailabilityStims-trials.csv")) %>% 
  filter(workerid != '379') %>%  #NNS
  filter(workerid != '377') %>% # Returned (consent revokes)
  filter(workerid !='418') #timed out (Prolific doesn't show them as paid)


df.mean_norms <- df.raw_norms %>% 
  mutate(mirroringCondition = as.logical(mirroringCondition),
         item = recode(scene, 'cheesemushroom' = 'cheesemushrooms')) %>%
  rename(foreCondition = foregrounded) %>% 
  select(verb, item, foreCondition, mirroringCondition, response) %>% 
  group_by(item, foreCondition, mirroringCondition) %>% 
  summarize(affectedness = mean(response))

# Add the affectedness
df.trial_data <- left_join(df.trial_data, df.mean_norms)


# Step 8: Add a suprisal for each utterance
surp <- read_csv("surprisals.csv") %>%
  rename(peer_name = participant_audio_id, index = trial_index) %>% 
  select(-sentence)

df.trial_data <- left_join(df.trial_data,
                           surp, 
                           by = join_by(peer_name, index)) %>%
  mutate(first_noun = as_factor(first_noun))

by_item_surprisal_value <- df.trial_data %>% 
  group_by(verb, item, first_noun) %>%
  summarize(mean_surp = mean(surprisal)) 

# Step 8.5: Calculate a mean suprisal for location-first and substance-first 
# form of each each item (verb, noun, noun combination). 
# There is no location-first "put" surprisal value: since location-first is just
# a different event construal, they were thrown away during coding. 
by_item_surprisal_ratio <- by_item_surprisal_value %>%
  pivot_wider(values_from = mean_surp, 
              names_from = first_noun, 
              values_fill = 2) %>% 
  mutate(surprisal_ratio = sub/loc ) %>% 
  select(verb, item, surprisal_ratio) 

df.trial_data <- left_join(df.trial_data, 
                           by_item_surprisal_ratio, 
                           by = join_by(item, verb))
df.trial_data <- left_join(df.trial_data, 
                           by_item_surprisal_value, 
                           by = join_by(item, verb, first_noun))

# Fix up column names and types
df.trial_data <- df.trial_data %>% 
  rename(firstNoun = first_noun, 
         infCondition = informativityCondition, 
         textSurprisal = surprisal, 
         meanFormSurprisal = mean_surp,
         subToLocSurprisalRatio = surprisal_ratio) %>% 
  mutate(foreCondition = as.factor(foreCondition), 
         infCondition = as.factor(infCondition), 
         mirroringCondition = as.factor(mirroringCondition)) %>% 
  mutate(trialType =case_when(
    verb %in% c("spray", "spread", "load", "stuff") ~ "sprayload",
    .default = 'control'))
  
save(df.trial_data, file="cleaned_data.Rda")
