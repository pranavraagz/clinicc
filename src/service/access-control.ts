import { AccessControl } from "accesscontrol";

export const ac = new AccessControl();

ac.grant("staff")
  .readAny("patient")
  .createAny("patient")
  .updateAny("patient")
  .deleteAny("patient")
  .readAny("appointment")
  .createAny("appointment")
  .updateAny("appointment")
  .deleteAny("appointment");

ac.grant("admin")
  .extend("staff")
  .updateAny("patient")
  .deleteAny("patient")
  .createAny("staff")
  .updateAny("staff");

ac.lock();
