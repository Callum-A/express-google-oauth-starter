import axios from 'axios';
import qs from 'querystring';

interface GetGoogleOAuthTokens {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
    id_token: string;
}

class OAuthService {
    private clientId: string;
    private clientSecret: string;
    private redirectUrl: string;
    constructor(clientId: string, clientSecret: string, redirectUrl: string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
    }

    getGoogleOAuthTokens = async (code: string) => {
        const url = 'https://oauth2.googleapis.com/token';
        const values = {
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUrl,
            grant_type: 'authorization_code',
            access_type: 'offline',
        };

        try {
            const res = await axios.post<GetGoogleOAuthTokens>(
                url,
                qs.stringify(values),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
            return res.data;
        } catch (err: any) {
            console.error(err);
            throw new Error('Google OAuth error');
        }
    };
}

export default OAuthService;
