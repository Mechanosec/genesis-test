import { IsMilitaryTime, IsString } from 'class-validator';

export default class PrintMeAtSchema {
  @IsString()
  message: string;

  @IsMilitaryTime()
  time: string;
}
