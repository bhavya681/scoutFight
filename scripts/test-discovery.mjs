import { discoverMmaFightersFromSportsDb } from "../src/lib/integrations/the-sports-db.ts";
import { fetchWikidataWrestlers } from "../src/lib/integrations/wikidata.ts";

const mma = await discoverMmaFightersFromSportsDb(10, ["UFC"]);
const wiki = await fetchWikidataWrestlers(5);
console.log("MMA sample:", mma.length, mma[0]?.displayName);
console.log("Wikidata sample:", wiki.length, wiki[0]?.displayName);
