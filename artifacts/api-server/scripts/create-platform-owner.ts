/* One-off: create/ensure the platform owner account in Clerk. Prints the Clerk user id. */
import { clerkClient as clerk } from "@clerk/express";

const EMAIL = process.env.OWNER_EMAIL!;
const PASSWORD = process.env.OWNER_PASSWORD!;

async function main() {
  if (!EMAIL || !PASSWORD) throw new Error("OWNER_EMAIL and OWNER_PASSWORD required");
  const existing = await clerk.users.getUserList({ emailAddress: [EMAIL] });
  let clerkUser = existing.data[0];
  if (!clerkUser) {
    clerkUser = await clerk.users.createUser({
      emailAddress: [EMAIL],
      password: PASSWORD,
      skipPasswordChecks: true,
    });
    console.log("CREATED", clerkUser.id);
  } else {
    await clerk.users.updateUser(clerkUser.id, { password: PASSWORD, skipPasswordChecks: true });
    console.log("EXISTED", clerkUser.id);
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
