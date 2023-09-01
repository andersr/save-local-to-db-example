import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLocalStorage } from "~/hooks";
import {
  ANON_USER_LOCAL_STORAGE_CONTENT,
  REDIRECT_TO_PARAM,
  SAVE_ANON_ROUTE,
} from "~/shared";

import { useOptionalUser } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();

  const [value, setValue] = useLocalStorage(
    ANON_USER_LOCAL_STORAGE_CONTENT,
    "",
  );

  const noteHasContent = (value as string).trim() !== "";

  function displaySaveStatus() {
    if (noteHasContent) {
      return (
        <span>
          Saved locally.{" "}
          <Link to={`/login${setParam()}`} className="text-gray-400 underline">
            Save to my notes
          </Link>
          .
        </span>
      );
    }
    return "";
  }

  function setParam() {
    return noteHasContent
      ? `?${REDIRECT_TO_PARAM}=${encodeURIComponent(SAVE_ANON_ROUTE)}`
      : "";
  }
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">Anon Note To Db Example</h1>
        {user ? (
          <div>
            <Link to="/notes" className="">
              View Notes for {user.email}
            </Link>
          </div>
        ) : (
          <div className="">
            <Link
              to={`/join${setParam()}`}
              className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600 mr-4"
            >
              Sign up
            </Link>
            <Link
              to={`/login${setParam()}`}
              className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Log In
            </Link>
          </div>
        )}
      </header>
      <main className="p-8">
        <div className="w-[400px] mx-auto">
          <textarea
            className="w-full rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            value={value}
            rows={8}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write something..."
          />
          <div className="py-2 text-sm text-slate-500">
            {displaySaveStatus()}
          </div>
        </div>
      </main>
    </div>
  );
}
