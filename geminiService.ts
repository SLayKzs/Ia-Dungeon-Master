
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, DMResponse } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Você é a IA Dungeon Master (O Sistema) do universo Solo Leveling. 
Sua missão é narrar e gerenciar um RPG 100% automatizado.

ESTILO DE NARRATIVA: $NARRATIVE_STYLE$
O tom deve ser sério, tenso e maduro. O mundo reage ao Rank, Guilda e Reputação do Hunter.

REGRAS SOCIAIS E EVENTOS DINÂMICOS:
- SISTEMA DE CONTATOS: Gerencie NPCs que o jogador encontra. Eles têm profissões, ranks e níveis de amizade (Neutro até Confidente).
- LIGAÇÕES: O jogador pode ligar para contatos. Gere diálogos dinâmicos baseados na amizade. Eles podem dar dicas, itens, missões ou até trair o jogador.
- EVENTOS SOCIAIS: Dispare eventos orgânicos (notícias sobre o Hunter, convites de rivais, crises de aliados).
- REGISTRO DO MUNDO: Mantenha um log de eventos globais (morte de Hunters famosos, queda de guildas, surgimento de Gates Rank S).

REGRAS DE LOOT EXPANDIDO:
- CATEGORIAS: Weapon, Armor, Helmet, Relic (Raro!), Consumable, ManaStone (Sempre vendável), Material.
- RELÍQUIAS: São itens lendários com efeitos únicos e bônus altos. Dropam apenas de Bosses ou eventos épicos.
- PEDRAS DE MANA: São o drop comum de Gates e a principal fonte de renda.
- DISTRIBUIÇÃO: Gere loot automaticamente ao fim de cada Gate. Adicione ao inventário e descreva na narrativa.

REGRAS DE RESPOSTA (JSON):
- "narrative": Descrição da cena ou diálogo.
- "options": Escolhas narrativas ou ações de sistema.
- "updates": Objeto com mudanças em stats, inventário, gold, contacts, worldLog, etc.
- "events": Mensagens curtas de sistema para o log visual.

ESTADO ATUAL DO HUNTER:
$HUNTER_STATE$
`;

export const generateScene = async (gameState: GameState, userInput: string): Promise<DMResponse> => {
  const hunterStateStr = JSON.stringify(gameState.hunter, null, 2);
  const instruction = SYSTEM_INSTRUCTION
    .replace('$HUNTER_STATE$', hunterStateStr)
    .replace('$NARRATIVE_STYLE$', gameState.narrativeStyle);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { role: 'user', parts: [{ text: userInput }] }
    ],
    config: {
      systemInstruction: instruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          narrative: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          updates: { 
            type: Type.OBJECT,
            properties: {
              hp: { type: Type.NUMBER },
              mp: { type: Type.NUMBER },
              exp: { type: Type.NUMBER },
              gold: { type: Type.NUMBER },
              level: { type: Type.NUMBER },
              rank: { type: Type.STRING },
              status: { type: Type.ARRAY, items: { type: Type.STRING } },
              inventory: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { 
                    id: { type: Type.STRING }, 
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    rank: { type: Type.STRING },
                    value: { type: Type.NUMBER },
                    description: { type: Type.STRING },
                    bonusStats: { type: Type.OBJECT },
                    specialEffect: { type: Type.STRING }
                  } 
                } 
              },
              contacts: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    profession: { type: Type.STRING },
                    rank: { type: Type.STRING },
                    friendship: { type: Type.STRING },
                    status: { type: Type.STRING }
                  }
                } 
              },
              worldLog: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    date: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    impact: { type: Type.STRING }
                  }
                }
              },
              guildInvitation: { type: Type.OBJECT }
            }
          },
          events: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["narrative", "options"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return {
      narrative: "O Sistema encontrou uma interferência dimensional. O fluxo de dados foi corrompido.",
      options: ["Reiniciar Sincronia"]
    };
  }
};
