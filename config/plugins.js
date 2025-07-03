module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        accessKeyId: "AKIA3FQSXGHA6COKK3NN",
        secretAccessKey: "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",
        region: "eu-west-2",
        params: {
          Bucket: "dev-blog.plutio.com",
        },
      },
    },
  },
  navigation: {
    enabled: false,
  },
  transformer: {
    enabled: true,
    config: {
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      },
    },
  },
  "preview-button": {
    config: {
      contentTypes: [
        {
          uid: "api::post.post",
          draft: {
            url: `https://l.plutio.com/callback/vercel-preview?secret=${process.env.VERCEL_REVALIDATE_TOKEN}&path=/blog/{slug}`,
            query: {
              type: "page",
              slug: "{slug}",
            },
          },
          published: {
            url: "https://www.plutio.com/blog/{slug}",
          },
        },
        {
          uid: "api::changelog.changelog",
          draft: {
            url: `https://l.plutio.com/callback/vercel-preview?secret=${process.env.VERCEL_REVALIDATE_TOKEN}&path=/changelog`,
          },
          published: {
            url: "https://www.plutio.com/changelog",
          },
        },
        {
          uid: "api::legal-page.legal-page",
          draft: {
            url: `https://l.plutio.com/callback/vercel-preview?secret=${process.env.VERCEL_REVALIDATE_TOKEN}&path=/legal/{slug}`,
            query: {
              type: "page",
              slug: "{slug}",
            },
          },
          published: {
            url: "https://www.plutio.com/legal/{slug}",
          },
        },
        {
          uid: "api::product.product",
          draft: {
            url: `https://l.plutio.com/callback/vercel-preview?secret=${process.env.VERCEL_REVALIDATE_TOKEN}&path=/product/{slug}`,
            query: {
              type: "page",
              slug: "{slug}",
            },
          },
          published: {
            url: "https://www.plutio.com/product/{slug}",
          },
        },
        {
          uid: "api::compare.compare",
          draft: {
            url: `https://l.plutio.com/callback/vercel-preview?secret=${process.env.VERCEL_REVALIDATE_TOKEN}&path=/compare/{slug}`,
            query: {
              type: "page",
              slug: "{slug}",
            },
          },
          published: {
            url: "https://www.plutio.com/compare/{slug}",
          },
        },
        {
          uid: "api::story.story",
          draft: {
            url: `https://l.plutio.com/callback/vercel-preview?secret=${process.env.VERCEL_REVALIDATE_TOKEN}&path=/story/{pageSlug}`,
            query: {
              type: "page",
              slug: "{pageSlug}",
            },
          },
          published: {
            url: "https://www.plutio.com/story/{pageSlug}",
          },
        },
        {
          uid: "api::template.template",
          draft: {
            url: `https://l.plutio.com/callback/vercel-preview?secret=${process.env.VERCEL_REVALIDATE_TOKEN}&path=/templates/{slug}`,
            query: {
              type: "page",
              slug: "{slug}",
            },
          },
          published: {
            url: "https://www.plutio.com/templates/{slug}",
          },
        },
        {
          uid: "api::solution.solution",
          draft: {
            url: `https://l.plutio.com/callback/vercel-preview?secret=${process.env.VERCEL_REVALIDATE_TOKEN}&path=/solution/{slug}`,
            query: {
              type: "page",
              slug: "{slug}",
            },
          },
          published: {
            url: "https://www.plutio.com/solution/{slug}",
          },
        },
      
      ],
    },
  },
  "duplicate-button": true
});
