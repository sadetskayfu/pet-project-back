import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { COOKIE_TIME_LIFE } from 'src/shared/constants';

@Injectable()
export class CookieService {
    static tokenKey = 'access-token'

    setToken(res: Response, token: string){
        res.cookie(CookieService.tokenKey, token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: COOKIE_TIME_LIFE
        })
    }

    removeToken(res: Response){
        res.clearCookie(CookieService.tokenKey)
    }
}
