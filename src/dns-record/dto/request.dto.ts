import { IsUrl } from 'class-validator';

export class GetByDomainNameDto {
  @IsUrl()
  domainName: string;
}
