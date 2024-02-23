import { z } from "zod";
import { schemaChatProps } from "./chatprops";

export type TSchemaChatProps = z.infer<typeof schemaChatProps>;
