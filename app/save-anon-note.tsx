import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useNavigate, useSubmit } from "@remix-run/react";
import { useEffect } from "react";
import { LiaSpinnerSolid } from "react-icons/lia";
import { getUserId } from "~/session.server";
import { ANON_USER_LOCAL_STORAGE_CONTENT } from "~/shared";
import { newNoteAction as action } from "~/shared/newNoteAction.server";

export const loader: LoaderFunction = async ({ request }) => {
  // TODO: redirect to login with redirect-to param back to this route
  const userId = await getUserId(request);
  if (!userId) return redirect("/");
  return json({});
};

export { action };

export default function SaveAnonNote() {
  const navigate = useNavigate();
  const submit = useSubmit();

  useEffect(() => {
    const localContent = window.localStorage.getItem(
      ANON_USER_LOCAL_STORAGE_CONTENT,
    );

    function handleAnonNote(localContent: string) {
      try {
        const noteContent = JSON.parse(localContent);
        if (noteContent.trim() === "") {
          throw new Error("No note content");
        }

        const lines = noteContent.split("\n");
        const title = lines[0];
        const body = lines.length > 0 ? lines.slice(1).join(" ") : "";

        let formData = new FormData();
        formData.append("title", title);
        formData.append("body", body);

        submit(formData, { method: "post" });
      } catch (error) {
        console.warn("anon note error: ", error);
        navigate("/");
      }
    }

    if (localContent) {
      handleAnonNote(localContent);
    }
  }, [navigate, submit]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <LiaSpinnerSolid
        size={"30px"}
        title="Loading"
        className="text-primary animate-spin text-6xl"
      />
    </div>
  );
}