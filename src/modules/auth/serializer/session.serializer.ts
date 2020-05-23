import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { SessionPayload } from '../interfaces/session-payload.interface';
import { UserService } from '../../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }

  serializeUser(
    user: SessionPayload,
    done: (err: Error | null, userId: string) => void,
  ): void {
    done(null, user.id);
  }

  deserializeUser(
    userId: string,
    done: (err: Error | null, payload?: SessionPayload) => void,
  ): void {
    this.userService
      .findById(userId)
      .then(user => {
        return done(null, user.toSessionSerializer());
      })
      .catch(error => done(error));
  }
}
