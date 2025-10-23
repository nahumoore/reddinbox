interface FeedbackRequestEmailParams {
  first_name: string;
}

export const feedbackRequestEmailTemplate = ({
  first_name,
}: FeedbackRequestEmailParams): string => {
  return `Hey ${first_name}!

Just saw you started using Reddinbox and wanted to reach out real quick

I'm building this thing to help founders grow and get leads from Reddit without being spammy, but honestly I can only make it better if you tell me what's working (or what's not lol)

Got any feedback? Literally anything helps, even just a quick "this is cool" or "this sucks" haha

Thanks for trying it out btw <3

Nico
Building Reddinbox
`;
};
