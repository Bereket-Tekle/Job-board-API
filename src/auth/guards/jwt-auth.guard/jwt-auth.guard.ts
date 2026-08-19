import { AuthGuard } from "@nestjs/passport/dist/auth.guard";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

