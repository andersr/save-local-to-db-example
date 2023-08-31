import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLocalStorage } from "~/hooks";
import { ANON_USER_LOCAL_STORAGE_CONTENT, REDIRECT_TO_PARAM } from "~/shared";
import { SAVE_ANON_ROUTE } from "~/shared/routes";

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
      return <span>Saved locally</span>;
    }
    return (
      <span>
        Saved locally until{" "}
        <Link to={`/login${setParam()}`} className="text-gray-400 underline">
          login
        </Link>
        .
      </span>
    );
  }

  function setParam() {
    return noteHasContent
      ? `?${REDIRECT_TO_PARAM}=${encodeURIComponent(SAVE_ANON_ROUTE)}`
      : "";
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div>
        <textarea
          className="border p-2 border-slate-300 block"
          value={value}
          rows={4}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write something..."
        />
        <div className="py-2 text-sm text-slate-500">{displaySaveStatus()}</div>
      </div>
      <div className="p-4">
        {user ? (
          <div>
            <Link to="/notes" className="">
              View Notes for {user.email} TODO: come back to this.
            </Link>
            <form action="/logout" method="post">
              <button type="submit" className="button">
                Logout
              </button>
            </form>
          </div>
        ) : (
          <div className="">
            <Link to={`/join${setParam()}`} className="">
              Sign up
            </Link>
            <Link to={`/login${setParam()}`} className="">
              Log In
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
