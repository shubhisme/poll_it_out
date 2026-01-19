"use client";

import Navbar from "@/app/components/Navbar";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useCallback, useEffect } from "react";
import type Poll_data from "@/app/types/Poll_types";
import { useUser } from "@clerk/nextjs";

function Page() {
  const {isLoaded , isSignedIn , user} = useUser();
  const [polld, setPolld] = useState<Poll_data>({
    question: "",
    description: "",
    options: [],
    duration: "Forever",
    qr: "",
    multi_true: false,
  } as Poll_data);

  const [options, setOptions] = useState(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qr , setQr] = useState<string | null>(null);
  const router = useRouter();

  const duration_option = [
    "3 minutes",
    "5 minutes",
    "10 minutes",
    "1 hour",
    "3 hours",
    "Forever",
  ];

  // replace apiCall and handlers with safer versions
  const apiCall = 
  useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setError(null);

      // basic validation
      const cleanedOptions = options.map((o) => o.trim()).filter(Boolean);
      if (!polld?.question?.trim()) {
        setError("Question is required");
        return;
      }
      if (cleanedOptions.length < 2) {
        setError("At least two non-empty options are required");
        return;
      }

      console.log("Submitting poll:", {
        question: polld.question,
        description: polld.description,
        options: cleanedOptions,
        duration: polld?.duration,
        multi_true: polld?.multi_true,
      });

      setSubmitting(true);
      try {
        const response = await fetch("/api/createpoll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: polld.question,
            description: polld.description,
            options: cleanedOptions,
            duration: polld?.duration ?? "Forever",
            multi_true: polld?.multi_true ?? false,
          }),
        });

        const { data, error } = await response.json();

        if (error) {
          setError(error);
          return;
        }

        if (response.status === 401) {
          router.push("/(auth)/signin/");
          return;
        }

        console.log("Poll created:", data);
        // success: navigate to poll page or show message
        router.push(
          `/dashboard/poll/${data._id ?? data.insertedId ?? data.id}`
        );
        
        setPolld({
          question: "",
          description: "",
          duration: "Forever",
          qr: "",
          options: [],
        } as Poll_data);

        setOptions(["", ""]);

      } catch (err) {
        setError("Failed to create poll. Try again.");
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
    [polld, options, router]
  );

  const handelChange = useCallback(
    (index: number, value: string) => {
      setOptions((prev) => {
        const newOp = [...prev];
        newOp[index] = value;
        return newOp;
      });
      setPolld(
        (current) => ({ ...(current ?? {}), options: options } as Poll_data)
      );
    },
    [options]
  );

  const removeoptions = (index: number) => {
    const newop = options.filter((_, i) => i != index);
    setOptions(newop);
  };

  const addOptions = () => {
    if (options.length === 15) return;
    setOptions([...options, ""]);
  };

  return (
    <>
      <Navbar />
      <div className="flex w-4xl mx-auto mt-5">
        <div className="flex flex-col gap-y-2">
          <div>
            <h1 className="text-2xl font-semibold">Create a Poll</h1>
            <p className="text-[#8d9aa6]">
              Set up your question and options. Your poll will be live
              immediately after creation.
            </p>
          </div>

          <form onSubmit={apiCall}>
            <div className="flex flex-col gap-y-4 py-5">
              <div className="flex flex-col gap-y-1 border-2 px-6 py-4">
                <p className="text-lg">Poll Question</p>
                <p className="text-[#8d9aa6]">
                  Ask a clear, specific question that is easy to understand
                </p>

                <div className="flex flex-col gap-y-1">
                  <div>
                    <p>Question*</p>

                    <textarea
                      id="question"
                      value={polld?.question}
                      placeholder="What's your favorite programming language?"
                      required
                      onChange={(prev) =>
                        setPolld(
                          (current) =>
                            ({
                              ...current,
                              question: prev.target.value,
                            } as Poll_data)
                        )
                      }
                      className="w-[70%] min-h-20 bg-[#f3f4f6] px-4 py-2 rounded-md outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500 text-sm"
                    />
                  </div>

                  <div>
                    <p>Description (optional)</p>

                    <textarea
                      id="question"
                      value={polld?.description}
                      onChange={(prev) =>
                        setPolld(
                          (current) =>
                            ({
                              ...current,
                              description: prev.target.value,
                            } as Poll_data)
                        )
                      }
                      placeholder="Add context or additional details..."
                      className="w-[70%] min-h-20 bg-[#f3f4f6] px-4 py-2 rounded-md outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-y-3 border-2 px-6 py-4">
                <div>
                  <p className="text-lg">Answer Options</p>
                  <p className="text-[#8d9aa6]">
                    Add the choices participants can select from
                  </p>
                </div>

                <div className="flex flex-col gap-y-2">
                  {options.map((op, ind) => (
                    <div key={ind} className="flex gap-x-1">
                      <input
                        type="text"
                        required
                        value={op}
                        onChange={(e) => handelChange(ind, e.target.value)}
                        placeholder={`Option ${ind + 1}`}
                        className="border p-2 w-[70%] bg-[#f3f4f6] text-sm"
                      />

                      {options.length > 2 && (
                        <button
                          onClick={() => removeoptions(ind)}
                          type="button"
                          className="cursor-pointer border p-2 hover:bg-[#f3f4f6] "
                        >
                          <X
                            size={18}
                            className="hover:text-red-400 transition-colors delay-100"
                          />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  className="flex items-center justify-center w-full border py-1 text-center cursor-pointer shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none transition-all"
                  type="button"
                  onClick={addOptions}
                >
                  <Plus size={15} />
                  <span>
                    Add Options{" "}
                    <span
                      className={options.length === 15 ? `text-red-500` : ""}
                    >
                      (Maximum 15)
                    </span>
                  </span>
                </button>
              </div>

              <div className="flex flex-col gap-y-3 border-2 px-6 py-4">
                <div>
                  <p className="text-lg">Poll Settings</p>
                  <p className="text-[#8d9aa6]">
                    Configure how your poll behaves
                  </p>
                </div>

                <div className="flex flex-col gap-y-3">
                  <p>Duration</p>
                  <select
                    name=""
                    id="duration"
                    value={polld?.duration}
                    className="border px-3 py-1"
                    onChange={(prev) =>{

                        setPolld(
                            (current) =>
                          ({
                              ...current,
                              duration: prev.target.value,
                            } as Poll_data)
                        )
                        console.log(prev.target.value);
                    }}
                  >
                    {duration_option.map((val, ind) => {
                      if (val === "Forever") {
                        return (
                          <option
                            value={val}
                            key={ind}
                            className="bg-[#d4d6db]"
                          >
                            ∞ {val}
                          </option>
                        );
                      }

                      return (
                        <option
                          value={val}
                          key={ind}
                          className="hover:bg-[#d4d6db] mb-1"
                        >
                          {val}
                        </option>
                      );
                    })}
                  </select>

                  <div className="flex justify-between w-full items-center ">
                    <div>
                      <p>Allow Multiple Selections</p>
                      <p className="text-[#8d9aa6]">
                        Let participants choose more than one option
                      </p>
                    </div>

                    <div className="checkbox-apple">
                      <input
                        className="yep"
                        id="check-apple"
                        type="checkbox"
                        onChange={(prev) =>
                          setPolld(
                            (current) =>
                              ({
                                ...current,
                                multi_true: prev.target.checked,
                              } as Poll_data)
                          )
                        }
                      />
                      <label htmlFor="check-apple"></label>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full text-white text-lg font-semibold bg-black py-1 shadow-[3px_3px_0px_gray] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                {submitting ? "Creating…" : "Create Poll"}
              </button>
              {error && (
                <div role="alert" className="text-red-500 mt-2">
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Page;
