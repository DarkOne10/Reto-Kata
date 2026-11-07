import { randomUUID } from 'node:crypto';
import { BadGatewayException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface ResumeUpload {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class ResumeStorageService {
  private supabaseClient: SupabaseClient | undefined;

  async upload(file: ResumeUpload) {
    const path = `${randomUUID()}.pdf`;
    const { error } = await this.client().storage
      .from(process.env.SUPABASE_BUCKET ?? 'candidate-resumes')
      .upload(path, file.buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (error) {
      throw new BadGatewayException('No se pudo guardar la hoja de vida.');
    }

    return path;
  }

  async remove(path: string) {
    const { error } = await this.client().storage
      .from(process.env.SUPABASE_BUCKET ?? 'candidate-resumes')
      .remove([path]);

    if (error) {
      throw new BadGatewayException('No se pudo limpiar la hoja de vida.');
    }
  }

  async createSignedUrl(path: string) {
    const { data, error } = await this.client()
      .storage.from(process.env.SUPABASE_BUCKET ?? 'candidate-resumes')
      .createSignedUrl(path, 900);

    if (error || !data?.signedUrl) {
      throw new BadGatewayException('No se pudo generar el enlace de la hoja de vida.');
    }

    return data.signedUrl;
  }

  private client() {
    if (this.supabaseClient) {
      return this.supabaseClient;
    }

    const url = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    if (!url || !secretKey) {
      throw new ServiceUnavailableException('Supabase Storage no está configurado.');
    }

    this.supabaseClient = createClient(url, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    return this.supabaseClient;
  }
}