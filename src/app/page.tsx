import { CakeSlice } from "lucide-react";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-start justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <div className="flex items-center gap-2">
          <CakeSlice className="" />
          <h3>Home</h3>
        </div>
        <ol className="list-inside list-decimal text-center font-[family-name:var(--font-geist-mono)] text-sm sm:text-left">
          <li className="mb-2">
            Basic Features{" "}
            <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]">
              Done
            </code>
          </li>

          <li className="mb-2">
            UI and Pages{" "}
            <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]">
              Work in progress
            </code>
          </li>

          <li className="mb-2">
            Optimization{" "}
            <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]">
              Not Started
            </code>
          </li>

          <li className="mb-2">
            Test Cases{" "}
            <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]">
              Not Started
            </code>
          </li>
        </ol>
      </main>
    </div>
  );
}
