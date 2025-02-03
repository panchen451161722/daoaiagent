import { Controller, Get, Path, Post, Put, Route, Body, Tags } from 'tsoa';
import { AIA, CreateAIADto, UpdateAIADto } from '../types';

@Route('aia')
@Tags('AIAs')
export class AiaController extends Controller {
  @Get('/aias')
  public async getAias(): Promise<AIA[]> {
    return [];
  }

  @Get('{id}')
  public async getAia(@Path() id: string): Promise<AIA> {
    return {
      id,
      name: 'Sample AIA',
      status: 'active'
    };
  }

  @Post()
  public async createAia(@Body() body: CreateAIADto): Promise<void> {
    // Implementation will be added later
  }

  @Put('{id}')
  public async updateAia(
    @Path() id: string,
    @Body() body: UpdateAIADto
  ): Promise<void> {
    // Implementation will be added later
  }
}
