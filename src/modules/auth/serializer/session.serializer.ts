import {PassportSerializer} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import { SessionPayload } from '../interfaces/session-payload.interface';


@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  serializeUser(user: SessionPayload, done: (err: Error | null, user: SessionPayload) => void): void {
    done(null, user);
  }

  deserializeUser(user: SessionPayload, done: (err: Error | null, payload?: SessionPayload) => void): void {
    done(null, user);
  }
}
