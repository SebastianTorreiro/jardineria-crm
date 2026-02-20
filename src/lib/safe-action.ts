import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { getUserOrganization } from '@/utils/supabase/queries';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type ActionError = {
  [key: string]: string[] | undefined;
};

export type ActionResponse<T> = {
  success: boolean;
  data?: T;
  fieldErrors?: ActionError;
  message?: string;
};

export type ActionContext = {
  orgId: string;
  supabase: SupabaseClient<Database>;
};

export function createSafeAction<TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput, ctx: ActionContext) => Promise<ActionResponse<TOutput>>
) {
  return async (prevStateOrFormData: any, formData?: FormData): Promise<ActionResponse<TOutput>> => {
    
    // 1. Validation Logic
    let inputData: any;

    // Case 1: Called from useActionState (prevState, formData)
    if (formData instanceof FormData) {
        inputData = Object.fromEntries(formData.entries());
    }
    // Case 2: Called directly with FormData (formData)
    else if (prevStateOrFormData instanceof FormData) {
        inputData = Object.fromEntries(prevStateOrFormData.entries());
    }
    // Case 3: Called directly with raw data object
    else {
        inputData = prevStateOrFormData;
    }

    const result = schema.safeParse(inputData);

    if (!result.success) {
      const flattenedErrors = result.error.flatten().fieldErrors;
      return {
        success: false,
        fieldErrors: flattenedErrors,
        message: 'Validation failed. Please check the inputs.',
      };
    }

    // 2. Auth & Context
    const supabase = await createClient();
    const orgId = await getUserOrganization(supabase);

    if (!orgId) {
      return {
        success: false,
        message: 'Unauthorized. Organization not found.',
      };
    }

    // 3. Execution & Error Masking
    try {
      return await handler(result.data, { orgId, supabase });
    } catch (error) {
      // Log the real error for debugging
      console.error('SERVER ACTION ERROR:', error);
      
      // Return a safe message to the UI
      return {
        success: false,
        message: 'Error interno del servidor. Por favor, intente más tarde.',
      };
    }
  };
}
