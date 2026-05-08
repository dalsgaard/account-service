// Generated — do not edit manually

import { SQSEvent } from "aws-lambda";
import { ReceiveCustomerDeleted } from "./account-service";

type Handler = (event: SQSEvent) => Promise<void>;
type Callback<T> = (message: T) => Promise<void>;

export function createHandler<T extends Callback<Parameters<T>[0]>>(callback: T): Handler {
  return async (event) => {
    for (const record of event.Records) {
      const sns = JSON.parse(record.body);
      await callback(JSON.parse(sns.Message));
    }
  }
}

/** Cascade-delete all accounts belonging to the deleted customer */
export const createCustomerDeletedHandler = createHandler<ReceiveCustomerDeleted>
