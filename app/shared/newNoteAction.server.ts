import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { LOCAL_NOTE_SAVED_PARAM } from "./params";

export const newNoteAction = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { body: null, title: "Title is required" } },
      { status: 400 },
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { body: "Body is required", title: null } },
      { status: 400 },
    );
  }

  const note = await createNote({ body, title, userId });

  return redirect(`/notes/${note.id}?${LOCAL_NOTE_SAVED_PARAM}=true`);
};
