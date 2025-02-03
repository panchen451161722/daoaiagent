import { Controller, Get, Path, Route, Tags } from 'tsoa';
import { Meeting } from '../types';

@Route('meeting')
@Tags('Meetings')
export class MeetingController extends Controller {
  @Get('/meetings')
  public async getMeetings(): Promise<Meeting[]> {
    return [];
  }

  @Get('{id}')
  public async getMeeting(@Path() id: string): Promise<Meeting> {
    return {
      id,
      title: 'Sample Meeting',
      date: new Date().toISOString(),
      status: 'scheduled'
    };
  }
}
