import { IsString, IsUrl } from "@nestjs/class-validator";

export class CreateLinkDto {
    id: number;

    @IsString()
    name: string;

    @IsUrl()
    url: string;
}
