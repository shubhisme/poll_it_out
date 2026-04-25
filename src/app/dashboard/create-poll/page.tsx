"use client";

import { Plus, X, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useCallback, useEffect } from "react";
import type Poll_data from "@/app/types/Poll_types";
import { useUser } from "@clerk/nextjs";
import CreatePollSkeleton from "./CreatePollSkeleton";
import { toast } from "sonner";

function Page() {
  const { isLoaded , user } = useUser();
  const [polld, setPolld] = useState<Poll_data>({
    // question: "",
    // description: "",
    // options: [],
    // duration: "Forever",
    // qr: "",
    multi_true: false,
  } as Poll_data);

  const [options, setOptions] = useState(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const duration_option = [
    "3 minutes",
    "5 minutes",
    "10 minutes",
    "1 hour",
    "3 hours",
    "Forever",
  ];

  const isValid = useCallback(()=>{
    if(!isLoaded) return false;

    if(!user){
        toast.error("Please sign in to create a poll");

        router.push(`/signin`);
    }
  } , [user , isLoaded , router])

  useEffect(()=>{
    isValid();
  } , [isValid])

  // replace apiCall and handlers with safer versions
  const apiCall = 
  useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      // basic validation
      const cleanedOptions = options.map((o) => o.trim()).filter(Boolean);
      if (!polld?.question?.trim()) {
        toast.error("Question is required");
        return;
      }
      if (cleanedOptions.length < 2) {
        toast.error("At least two non-empty options are required");
        return;
      }

    //   console.log("Submitting poll:", {
    //     question: polld.question,
    //     description: polld.description,
    //     options: cleanedOptions,
    //     duration: polld?.duration,
    //     multi_true: polld?.multi_true,
    //   });

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
          toast.error(error);
          return;
        }

        if (response.status === 401) {
          toast.error("Please sign in to create a poll");
          router.push("/signin/");
          return;
        }

        console.log("Poll created:", data);
        // success: navigate to poll page or show message
        toast.success("Poll created successfully!");
        
        router.push(
          `/dashboard/poll/${data._id ?? data.insertedId ?? data.id}`
        );
        
        setPolld({
        //   question: "",
        //   description: "",
          duration: "Forever",
        //   qr: "",
        //   options: [],
        } as Poll_data);

        setOptions(["", ""]);

      } catch (err) {
        toast.error("Failed to create poll. Try again.");
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
        (current) => ({ ...(current ?? {}), options: options.map(o => ({ text: o })) } as Poll_data)
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

  if (!isLoaded) {
    return <CreatePollSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* <Navbar /> */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-2xl mx-auto px-4 py-8 md:px-6">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create a Poll</h1>
            <p className="text-gray-600">
              Set up your question and options. Your poll will be live immediately after creation.
            </p>
          </div>

          <form onSubmit={apiCall} className="space-y-6">
            {/* Question Section */}
            <div className="border-2 border-black px-6 py-5">
              <div className="mb-4">
                <p className="text-lg font-semibold mb-1">Poll Question</p>
                <p className="text-sm text-gray-600">
                  Ask a clear, specific question that is easy to understand
                </p>
              </div>

              <div className="space-y-4">
                {/* Question Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Question *</label>
                  <textarea
                    id="question"
                    value={polld?.question}
                    placeholder="What's your favorite programming language?"
                    required
                    onChange={(e) =>
                      setPolld(
                        (current) =>
                          ({
                            ...current,
                            question: e.target.value,
                          } as Poll_data)
                      )
                    }
                    className="w-full min-h-24 bg-gray-100 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-500 text-sm transition-all"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description (optional)</label>
                  <textarea
                    id="description"
                    value={polld?.description}
                    onChange={(e) =>
                      setPolld(
                        (current) =>
                          ({
                            ...current,
                            description: e.target.value,
                          } as Poll_data)
                      )
                    }
                    placeholder="Add context or additional details..."
                    className="w-full min-h-20 bg-gray-100 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-500 text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Options Section */}
            <div className="border-2 border-black px-6 py-5">
              <div className="mb-4">
                <p className="text-lg font-semibold mb-1">Answer Options</p>
                <p className="text-sm text-gray-600">
                  Add the choices participants can select from
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {options.map((op, ind) => (
                  <div key={ind} className="flex gap-2 items-stretch">
                    <input
                      type="text"
                      required
                      value={op}
                      onChange={(e) => handelChange(ind, e.target.value)}
                      placeholder={`Option ${ind + 1}`}
                      className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                    {options.length > 2 && (
                      <button
                        onClick={() => removeoptions(ind)}
                        type="button"
                        className="px-3 border border-gray-300 rounded hover:bg-red-50 transition-colors flex items-center justify-center"
                        title="Remove option"
                      >
                        <X size={18} className="text-gray-600 hover:text-red-500" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 border-2 border-black py-2 font-semibold text-black bg-white shadow-[2px_2px_0px_black] hover:shadow-[3px_3px_0px_black] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
                type="button"
                onClick={addOptions}
                disabled={options.length === 15}
              >
                <Plus size={18} />
                <span>
                  Add Option {options.length === 15 && "(Maximum reached)"}
                </span>
              </button>
            </div>

            {/* Settings Section */}
            <div className="border-2 border-black px-6 py-5">
              <div className="mb-4">
                <p className="text-lg font-semibold mb-1">Poll Settings</p>
                <p className="text-sm text-gray-600">
                  Configure how your poll behaves
                </p>
              </div>

              <div className="space-y-5">
                {/* Duration Selector */}
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium mb-2">
                    Duration
                  </label>
                  <select
                    id="duration"
                    value={polld?.duration}
                    className="w-full px-4 py-2 border border-gray-300 bg-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    onChange={(e) => {
                      setPolld(
                        (current) =>
                          ({
                            ...current,
                            duration: e.target.value,
                          } as Poll_data)
                      );
                      console.log(e.target.value);
                    }}
                  >
                    {duration_option.map((val, ind) => (
                      <option value={val} key={ind}>
                        {val === "Forever" ? "∞ Forever" : val}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Multiple Selections Toggle */}
                <div className="flex items-center justify-between border border-gray-200 rounded p-4 bg-gray-50">
                  <div>
                    <p className="font-medium text-sm mb-1">Allow Multiple Selections</p>
                    <p className="text-xs text-gray-600">
                      Let participants choose more than one option
                    </p>
                  </div>

                  <div className="checkbox-apple">
                    <input
                      className="yep"
                      id="check-apple"
                      type="checkbox"
                      checked={polld?.multi_true ?? false}
                      onChange={(e) =>
                        setPolld(
                          (current) =>
                            ({
                              ...current,
                              multi_true: e.target.checked,
                            } as Poll_data)
                        )
                      }
                    />
                    <label htmlFor="check-apple"></label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 text-black text-lg font-bold bg-white border-2 border-black shadow-[3px_3px_0px_black] hover:shadow-[4px_4px_0px_black] active:translate-y-[2px] active:shadow-[1px_1px_0px_black] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  <span>Creating Poll…</span>
                </>
              ) : (
                "Create Poll"
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded">
            <p className="text-sm text-gray-700">
              💡 <strong>Tip:</strong> You can add up to 15 options. Make your questions clear and engaging to get better participation!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
