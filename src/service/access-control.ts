import { AccessControl } from "accesscontrol";

export const ac = new AccessControl();

ac.grant("staff")
  .createAny("patient")
  .readAny("patient")
  .createAny("appointment")
  .readAny("appointment")
  .updateAny("appointment")
  .deleteAny("appointment")
  .readOwn("staff")
  .updateOwn("staff")
  .read("doctor-availability")
  .read("doctor");

ac.grant("doctor")
  .extend("staff")
  .read("doctor")
  .updateOwn("doctor")
  .readAny("appointment-attend")
  .updateAny("appointment-attend");

ac.grant("admin")
  .extend("doctor")
  .updateAny("patient")
  .deleteAny("patient")
  .createAny("staff")
  .readAny("staff")
  .updateAny("staff")
  .deleteAny("staff")
  .create("user")
  .readAny("user")
  .update("user")
  .create("doctor")
  .readAny("doctor")
  .update("doctor")
  .readOwn("admin")
  .updateOwn("admin")
  .read("backup");

ac.grant("superadmin").extend("admin").delete("user");

ac.lock();
