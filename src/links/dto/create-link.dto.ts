import { IsString, IsUrl, IsNotEmpty } from "@nestjs/class-validator";

export class CreateLinkDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    uuid: string;

    @IsNotEmpty()
    @IsUrl()
    url: string;
}
