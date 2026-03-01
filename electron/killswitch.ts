import { net } from 'electron';

// Substitua pela URL raw do seu GitHub Gist antes do primeiro build de produção.
// Formato: https://gist.githubusercontent.com/<USER>/<GIST_ID>/raw/killswitch.json
const KILLSWITCH_URL = 'https://gist.githubusercontent.com/pedroth-dev/6990b1844f58da81c2fc0aca0d2b635f/raw/22d2cd49f7976fd33b37243c698bcca91500d0f7/killswitch.json';

export async function checkKillSwitch(): Promise<boolean> {
  try {
    const url = `${KILLSWITCH_URL}?t=${Date.now()}`;
    const response = await net.fetch(url, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const data = (await response.json()) as { active?: boolean };
    return data.active === true;
  } catch {
    return false;
  }
}
