import { Controller, Get, Path, Post, Route, Body, Tags } from 'tsoa';
import { DAO, CreateDAODto } from '../types';

@Route('dao')
@Tags('DAOs')
export class DaoController extends Controller {
  @Get('/daos')
  public async getDaos(): Promise<DAO[]> {
    return [];
  }

  @Get('{id}')
  public async getDao(@Path() id: string): Promise<DAO> {
    return {
      id,
      name: 'Sample DAO'
    };
  }

  @Post()
  public async createDao(@Body() body: CreateDAODto): Promise<void> {
    // Implementation will be added later
  }
}
