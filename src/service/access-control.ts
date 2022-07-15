import { AccessControl } from "accesscontrol";

export const ac = new AccessControl();

ac.grant("staff")
  .createAny("patient")
  .readAny("patient")
  .updateAny("patient")
  .deleteAny("patient")
  .createAny("appointment")
  .readAny("appointment")
  .updateAny("appointment")
  .deleteAny("appointment")
  .readOwn("staff")
  .updateOwn("staff");

ac.grant("doctor")
  .extend("staff")
  .readOwn("doctor")
  .updateOwn("doctor")
  .readAny("appointment-attend")
  .updateAny("appointment-attend");

ac.grant("admin")
  .extend("staff")
  .updateAny("patient")
  .deleteAny("patient")
  .createAny("staff")
  .readAny("staff")
  .updateAny("staff")
  .deleteAny("staff")
  .readOwn("admin")
  .updateOwn("admin");

ac.lock();
