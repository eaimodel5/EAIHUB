import { Type, Schema } from '@google/genai';

export const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: {
        process_phases: { type: Type.ARRAY, items: { type: Type.STRING } },
        coregulation_bands: { type: Type.ARRAY, items: { type: Type.STRING } },
        task_densities: { type: Type.ARRAY, items: { type: Type.STRING } },
        secondary_dimensions: { type: Type.ARRAY, items: { type: Type.STRING } },
        active_fix: { type: Type.STRING, nullable: true },
        reasoning: { type: Type.STRING },
        current_profile: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, nullable: true },
            subject: { type: Type.STRING, nullable: true },
            level: { type: Type.STRING, nullable: true },
            grade: { type: Type.STRING, nullable: true },
            goal: { type: Type.STRING, nullable: true }
          }
        },
        task_density_balance: { type: Type.NUMBER },
        epistemic_status: { type: Type.STRING },
        cognitive_mode: { type: Type.STRING },
        srl_state: { type: Type.STRING, enum: ['PLAN', 'MONITOR', 'REFLECT', 'ADJUST', 'UNKNOWN'] },
        mastery_check: { type: Type.BOOLEAN }
      },
      required: [
        'process_phases',
        'coregulation_bands',
        'task_densities',
        'reasoning',
        'task_density_balance',
        'srl_state'
      ]
    },
    conversational_response: { type: Type.STRING }
  },
  required: ['analysis', 'conversational_response'],
  propertyOrdering: ['analysis', 'conversational_response']
};
