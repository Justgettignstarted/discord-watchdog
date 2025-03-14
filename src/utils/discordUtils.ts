
export interface DiscordToken {
  id: string;
  value: string;
  isValid: boolean | null;
}

export interface ReportData {
  guildId: string;
  channelId: string;
  messageId: string;
  reason: string;
}

export enum ReportReason {
  IllegalContent = '0',
  Harassment = '1',
  SpamOrPhishing = '2',
  SelfHarm = '3',
  NSFWContent = '4'
}

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch('https://discord.com/api/v9/users/@me/library', {
      headers: {
        'Authorization': token,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
        'Accept': '*/*'
      }
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const sendReport = async (
  token: string, 
  channelId: string, 
  guildId: string, 
  messageId: string, 
  reason: string
): Promise<boolean> => {
  try {
    const response = await fetch('https://discord.com/api/v9/report', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel_id: channelId,
        guild_id: guildId,
        message_id: messageId,
        reason: reason
      })
    });
    
    return response.status === 201;
  } catch (error) {
    console.error('Error sending report:', error);
    return false;
  }
};
