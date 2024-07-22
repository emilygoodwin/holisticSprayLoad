import { usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";

export function ExitSurvey({ next }) {
  const labelClassName = "block text-sm font-medium text-gray-700 my-2";
  const inputClassName =
    "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm";
  const player = usePlayer();

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [browser, setBrowser] = useState("");
  const [fair, setFair] = useState("");
  const [feedback, setFeedback] = useState("");
  const [taskCorrectly, setTaskCorrectly] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [enjoyment, setEnjoyment] = useState("");

  function handleSubmit(event) {
    event.preventDefault()
    player.set("exitSurvey", {
      age,
      gender,
      nativeLanguage,
      browser,
      fair,
      feedback,
      taskCorrectly,
      enjoyment,
    });
    next();
  }

  function handleTaskCorrectlyChange(e) {
    setTaskCorrectly(e.target.value);
  }
  function handleEnjoymentChange(e) {
    setEnjoyment(e.target.value);
  }

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Alert title="Completion Code">
        <p>
          Please submit the following prolific completion code: {" "}
          <strong>CPYHVUVW</strong>
        </p>
      </Alert>

      <form
        className="mt-12 space-y-8 divide-y divide-gray-200"
        onSubmit={handleSubmit}
      >
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Exit Survey
              </h3>
              <p className="mt-1 text-sm text-gray-500">
              Thank you for completing the experiment! These questions are optional.
              </p>
            </div>

            <div className="space-y-8 mt-6">
              <div className="flex flex-row">
                <div >
                  <label htmlFor="email" className={labelClassName}>
                    Native Language
                  </label>
                  <div className="mt-1">
                    <input
                      id="nativeLanguage"
                      name="nativeLanguage"
                      autoComplete="off"
                      className={inputClassName}
                      value={nativeLanguage}
                      onChange={(e) => setNativeLanguage(e.target.value)}
                    />
                  </div>
                </div>
                
                
                <div className="ml-5">
                  <label htmlFor="email" className={labelClassName}>
                    Age
                  </label>
                  <div className="mt-1">
                    <input
                      id="age"
                      name="age"
                      type="number"
                      autoComplete="off"
                      className={inputClassName}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                </div>
                <div className="ml-5">
                  <label htmlFor="email" className={labelClassName}>
                    Gender
                  </label>
                  <div className="mt-1">
                    <input
                      id="gender"
                      name="gender"
                      autoComplete="off"
                      className={inputClassName}
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              

              <div>
                <label className={labelClassName}>
                Did you read the instructions and do you think you did the task correctly?
                </label>
                <div className="grid gap-2">
                  <Radio
                    selected={taskCorrectly}
                    name="taskCorrectly"
                    value="Yes"
                    label="Yes"
                    onChange={handleTaskCorrectlyChange}
                  />
                  <Radio
                    selected={taskCorrectly}
                    name="taskCorrectly"
                    value="No"
                    label="No"
                    onChange={handleTaskCorrectlyChange}
                  />
                  <Radio
                    selected={taskCorrectly}
                    name="taskCorrectly"
                    value="I was confused"
                    label="I was confused"
                    onChange={handleTaskCorrectlyChange}
                  />
                </div>
              </div>

              <div>
                <label className={labelClassName}>
                Did you enjoy the experiment?
                </label>
                <div className="grid gap-2">
                  <Radio
                    selected={enjoyment}
                    name="enjoyment"
                    value="yesEnjoy"
                    label="Yes"
                    onChange={handleEnjoymentChange}
                  />
                  <Radio
                    selected={enjoyment}
                    name="enjoyment"
                    value="NoEnjoy"
                    label="No"
                    onChange={handleEnjoymentChange}
                  />
                  <Radio
                    selected={enjoyment}
                    name="enjoyment"
                    value="BetterEnjoy"
                    label="Better than Average Experiment"
                    onChange={handleEnjoymentChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                <label className={labelClassName}>
                  What browser did you use to complete this experiment? 
                </label>

                <label className={labelClassName}>
                  Do you feel the pay was fair?
                </label>

                <label className={labelClassName}>
                  Feedback, including problems you encountered.
                </label>

                <textarea
                  className={inputClassName}
                  dir="auto"
                  id="browser"
                  name="browser"
                  rows={4}
                  value={browser}
                  onChange={(e) => setBrowser(e.target.value)}
                />

                <textarea
                  className={inputClassName}
                  dir="auto"
                  id="fair"
                  name="fair"
                  rows={4}
                  value={fair}
                  onChange={(e) => setFair(e.target.value)}
                />

                <textarea
                  className={inputClassName}
                  dir="auto"
                  id="feedback"
                  name="feedback"
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <div className="mb-12">
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export function Radio({ selected, name, value, label, onChange }) {
  return (
    <label className="text-sm font-medium text-gray-700">
      <input
        className="mr-2 shadow-sm sm:text-sm"
        type="radio"
        name={name}
        value={value}
        checked={selected === value}
        onChange={onChange}
      />
      {label}
    </label>
  );
}
