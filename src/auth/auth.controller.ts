import { loginType } from "./types/login.type";
import { Body, Controller, Logger, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService,
    private readonly logger: Logger) {}

  @Post("/login")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<loginType> {
    this.logger.log('[AuthController] [login] : Trying to login')

    const result = await this.authService.login(loginDto);

    res.cookie("access_token", result.token, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
    });

    return result;
  }

  @Post("/confirm")
  async confirmEmail(@Body() confirmDto: { token: string }) {
    this.logger.log('[AuthController] [confirmEmail] : Trying to set email')

    return this.authService.confirmEmail(confirmDto.token);
  }
}
