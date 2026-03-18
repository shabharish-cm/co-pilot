import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readJSON } from './file';
import { logger } from './logger';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function validateAgainstSchema(data: unknown, schemaPath: string): { valid: boolean; errors: string[] } {
  const schema = readJSON<object>(schemaPath);
  if (!schema) {
    logger.warn('Schema file not found', { schemaPath });
    return { valid: false, errors: [`Schema not found: ${schemaPath}`] };
  }

  const validate = ajv.compile(schema);
  const valid = validate(data) as boolean;
  const errors = valid ? [] : (validate.errors ?? []).map(e => `${e.instancePath} ${e.message}`);
  return { valid, errors };
}
