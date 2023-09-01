import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useNavigate, useSubmit } from "@remix-run/react";
import { useEffect } from "react";
import { LiaSpinnerSolid } from "react-icons/lia";
import { createNote } from "~/models/note.server";
import { getUserId, requireUserId } from "~/session.server";
import {
  ANON_USER_LOCAL_STORAGE_CONTENT,
  LOCAL_NOTE_SAVED_PARAM,
} from "~/shared";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body")?.toString() || "";

  if (typeof title !== "string" || title.length === 0) {
    throw redirect("/", 400);
  }

  const note = await createNote({ body, title, userId });

  return redirect(`/notes/${note.id}?${LOCAL_NOTE_SAVED_PARAM}=true`);
};

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
    } else {
      console.warn("no local content found");
      navigate("/");
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
