import { Controller, Post, Req, Body, UseGuards, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { AuthRoutes } from 'src/auth/routes/auth';
import { UnauthorizedResponse, NotFoundResponse, SuccessResponse } from 'src/auth/utils/auth-error-response.util';
import { Request } from 'express';

@ApiTags('Auth')
@Controller(AuthRoutes.BasePrefix)
@ApiBearerAuth()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post(AuthRoutes.Login)
  @ApiOperation({ summary: 'User login' })
  @SuccessResponse({
    access_token: { type: 'string' },
    refresh_token: { type: 'string' },
  })
  @UnauthorizedResponse
  @NotFoundResponse
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post(AuthRoutes.RefreshToken)
  @ApiOperation({ summary: 'Refresh access token' })
  @SuccessResponse({
    access_token: { type: 'string', example: 'NewAccessTokenString' },
  })
  @UnauthorizedResponse
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refreshToken(refreshDto.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Post(AuthRoutes.UpdatePassword)
  @ApiOperation({ summary: 'Update user password' })
  @SuccessResponse({
    message: { type: 'string', example: 'Password successfully updated.' },
  })
  @UnauthorizedResponse
  async updatePassword(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    this.logger.log(`Received user: ${JSON.stringify(user)}`);

    if (!user || !user['sub']) {
      throw new UnauthorizedException('User ID is missing');
    }

    return this.authService.updatePassword(updateUserDto, user);
  }
}
