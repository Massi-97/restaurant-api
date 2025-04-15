import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RestaurantDto {
  @IsString()
  @ApiProperty({ description: 'Username' })
  username: string;

  @IsString()
  @ApiProperty({ description: 'Restaurant code' })
  codeRestaurant: string; 

  @IsString()
  @ApiProperty({ description: 'Password' })
  password: string;
}