export type DnsRecord = {
  id: number;
  name: string;
  spf: string | null;
  dkim: string | null;
  dmarc: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type UpdateDnsRecord = {
  spf: string;
  dkim: string;
  dmarc: string;
  updated_at: Date;
};
