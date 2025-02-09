import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthConfig } from 'src/config/auth.config';

@Injectable()
export class CookieService {
    static tokenKey = 'access-token'
    
    constructor(private configService: ConfigService){}

    setToken(res: Response, token: string){
        res.cookie(CookieService.tokenKey, token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: this.configService.get<AuthConfig>('auth')?.cookieTimeLife
        })
    }

    removeToken(res: Response){
        res.clearCookie(CookieService.tokenKey)
    }
}
