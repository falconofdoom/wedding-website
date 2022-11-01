terraform {
  backend "s3" {
    bucket = "farrabs-wedding"
    key    = "us-east-1/farrabs-wedding-app-frontend/production.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      Name    = "farrabs-wedding-app-${local.environment}"
      app     = "farrabs-wedding-app-frontend"
      env     = "${local.environment}"
      project = "farrabs-wedding"
      repo    = "https://github.com/falconofdoom/wedding-website"
    }
  }
}


data "aws_route53_zone" "farrabs_hosted_zone" {
  name = "${local.domain}"
}

resource "aws_route53_record" "farrabs_wedding_frontend_cname" {
  zone_id = data.aws_route53_zone.farrabs_hosted_zone.zone_id
  name = "wedding.${local.domain}"
  type = "CNAME"
  ttl = 1800

  records = [
    "falconofdoom.github.io"
  ]
}


locals {
  domain = "farrabs.com"
  environment = "production"
}