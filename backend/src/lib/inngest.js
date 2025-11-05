import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "jbg-algo" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    await User.create(newUser);

    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    await deleteStreamUser(id.toString());
  }
);

const updateUser = inngest.createFunction(
  { id: "update-user" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const existingUser = await User.findOne({ clerkId: id });
    if (!existingUser) return;

    existingUser.name = `${first_name || ""} ${last_name || ""}`;
    existingUser.email = email_addresses?.[0]?.email_address || existingUser.email;
    existingUser.profileImage = image_url || existingUser.profileImage;

    await existingUser.save();

    await upsertStreamUser({
      id: existingUser.clerkId.toString(),
      name: existingUser.name,
      image: existingUser.profileImage,
    });

    console.log(`User ${id} updated in MongoDB`);
  }
);

export const functions = [syncUser, deleteUserFromDB, updateUser];
