library(tidyverse)
library(gridExtra)
library(viridis)
rm(list=ls())
library(ggplot2)
library(tidyverse)
library(rwebppl)

#critical conditions vary according to two factors: 
#which NP is informative: either location or substance differs between images
#which NP is backgrounded: either location or substance is distant in images 
informativeConditions <- c("Loc", "Sub") 
backgroundingConditions <- c("Loc", "Sub")
#prior over utterances
priors <- seq(from = .01, to = 1, by = .3) 
utterancePriorDown <- .3
#Utterance cost for backgrounded NPs
costs <- seq(from = 0, to = 1, by = .3)
# How optimal is the speaker (usually written alpha )
speakerOptimalities <- seq(from = 1, to = 10, by = 3) 



pragSpeakerDfs <- list()
literalListenerDfs <- list()
system.time( #~ 1 min when 2 possible values for prior, cost, and optimality
  #3.5 min when 4 possible values
  for (informativeCondition in informativeConditions){
  pragSpeakerDF <- data.frame(double(), double(), double(), double(), double(), double(), double())
  names(pragSpeakerDF) <- c('informativeCondition', 'backgroundingCondition', 'prior', 'utterancePriorDown',  'cost', 'speakerOptimality', 'prob')
  
  literalListenerDF <- data.frame(double(), double(), double(), double(), double(), double(), double())
  names(literalListenerDF) <- c('informativeCondition', 'backgroundingCondition', 'prior', 'utterancePriorDown', 'cost', 'speakerOptimality', 'prob')
  for (backgroundingCondition in backgroundingConditions) {
    for (utterancePrior in priors) {
      for (cost in costs) {
        for (speakerOptimality in speakerOptimalities) {
          settings <- data.frame(
            utterancePrior = utterancePrior, 
            utterancePriorDown = utterancePriorDown, 
            backgroundedCost = cost, 
            speakerOptimality = speakerOptimality, 
            backgroundingCondition = backgroundingCondition, 
            informativeCondition = informativeCondition)
          
          output <- c(webppl(program_file = 'models/model.js', data = settings, data_var = "dataFromR"))
          literalListenerDF[nrow(literalListenerDF) + 1,] <- c(informativeCondition, backgroundingCondition, utterancePrior, utterancePriorDown, cost, speakerOptimality, data.frame(prob = output)[1, 'prob'])
          pragSpeakerDF[nrow(pragSpeakerDF) + 1,] <- c(informativeCondition, backgroundingCondition, utterancePrior, utterancePriorDown, cost, speakerOptimality, data.frame(prob = output)[2, 'prob'])
        }
      }
    }
    
  }
  pragSpeakerDfs[[informativeCondition]] <- pragSpeakerDF
  literalListenerDfs[[informativeCondition]] <- literalListenerDF
  })

combined_pragSpeakerDfs <- do.call(rbind, pragSpeakerDfs)
combined_pragSpeakerDfs$prior <- as.numeric(combined_pragSpeakerDfs$prior)
combined_pragSpeakerDfs$priorDown <- as.numeric(combined_pragSpeakerDfs$utterancePriorDown)
combined_pragSpeakerDfs$cost <- as.numeric(combined_pragSpeakerDfs$cost)
combined_pragSpeakerDfs$prob <- as.numeric(combined_pragSpeakerDfs$prob)
combined_pragSpeakerDfs$speakerOptimality <- as.numeric(combined_pragSpeakerDfs$speakerOptimality)
combined_pragSpeakerDfs$backgroundingCondition <- factor(combined_pragSpeakerDfs$backgroundingCondition)

combined_pragSpeakerDfs$informativeCondition <- factor(combined_pragSpeakerDfs$informativeCondition)

combined_literalListenerDfs <- do.call(rbind, literalListenerDfs)
combined_literalListenerDfs$prior <- as.numeric(combined_literalListenerDfs$prior)
combined_literalListenerDfs$priorDown <- as.numeric(combined_pragSpeakerDfs$utterancePriorDown)
combined_literalListenerDfs$cost <- as.numeric(combined_literalListenerDfs$cost)
combined_literalListenerDfs$prob <- as.numeric(combined_literalListenerDfs$prob)
combined_literalListenerDfs$speakerOptimality <- as.numeric(combined_literalListenerDfs$speakerOptimality)
combined_literalListenerDfs$backgroundingCondition <- factor(combined_literalListenerDfs$backgroundingCondition)
combined_literalListenerDfs$informativeCondition <- factor(combined_literalListenerDfs$informativeCondition)


save(combined_pragSpeakerDfs, file ='model_pragSpeaker_predictions.Rda')
save(combined_literalListenerDfs, file ='model_literalListener_predictions.Rda')

# load('model_pragSpeaker_predictions.Rda')
# load('model_literalListener_predictions.Rda')

levels(combined_pragSpeakerDfs$informativeCondition) <- c("LOC informative", "SUB informative")
levels(combined_pragSpeakerDfs$backgroundingCondition) <- c("SUB Foregrounded", "LOC Foregrounded")

p <- combined_pragSpeakerDfs %>% 
  group_by(speakerOptimality, cost, backgroundingCondition, informativeCondition) %>% 
  summarize(prob = mean(prob)) %>% 
  ggplot(aes(x = speakerOptimality, 
                y = cost, 
                fill = prob)) +
  geom_tile() +
  scale_fill_viridis(limits = c(0,1)) +
  labs(x = "Speaker Optimality", y = "Backgrounding Cost", fill = "probability") +
  facet_grid(backgroundingCondition~informativeCondition, 
             labeller = as_labeller(default=label_wrap_gen(10), 
             c(`LOC informative` = "Location Informative", 
               `SUB informative` = "Substance Informative", 
               `LOC Foregrounded` = "Location Foregrounded", 
               `SUB Foregrounded` = "Substance Foregrounded"))) +
  labs(fill = "Probability") +
  theme(text=element_text(size=21)) + 
  guides(fill = guide_colorbar(title.vjust = 2.5))

p
ggsave("modelPredictions/speakerOptimality_uttCost.pdf")

q <- combined_pragSpeakerDfs %>%
  ggplot(aes(x = prior, 
             y = cost, 
             fill = prob)) +
  geom_tile() +
  scale_fill_viridis() +
  labs(x = "Utterance Prior", 
       y = "cost of utterance", 
       fill = "probability") +
  facet_grid(backgroundingCondition~informativeCondition, 
             labeller = as_labeller(c(`LOC informative` = "w not informative", 
                                      `SUB informative` = "w informative", 
                                      `LOC Foregrounded` = "W backgrounded", 
                                      `SUB Foregrounded` = "W Foregrounded")))+ 
  labs(title = "Probability of Producing w")
q

ggsave("modelPredictions/uttPrior_uttCost.png")


#plot literal listener distribution 
p <- ggplot(combined_literalListenerDfs, aes(x = speakerOptimality, 
                                             y = cost, 
                                             fill = prob)) +
  geom_tile() +
  scale_fill_viridis() +
  labs(x = "speakerOptimality", 
       y = "cost of utterance", 
       fill = "probability") +
  facet_grid(backgroundingCondition~informativeCondition)+ 
  labs(title = "L0: P(r = |paint|) with utterance 'paint'")
p 
ggsave("modelPredictions/L0_speakerOpt_uttCost.png")



p <- ggplot(combined_literalListenerDfs, aes(x = prior, 
                                             y = cost, 
                                             fill = prob)) +
  geom_tile() +
  scale_fill_viridis() +
  labs(x = "Utterance Prior", y = "cost of utterance", fill = "probability") +
  facet_grid(backgroundingCondition~informativeCondition)+ 
  labs(title = "L0: P(r = |paint|) with utterance 'paint'")
p
ggsave("modelPredictions/L0_uttPrior_uttCost.png")
