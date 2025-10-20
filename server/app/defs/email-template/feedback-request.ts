interface FeedbackRequestEmailParams {
  first_name: string;
}

export const feedbackRequestEmailTemplate = ({
  first_name,
}: FeedbackRequestEmailParams): string => {
  return `Hey ${first_name},

I noticed you recently started using Reddinbox and wanted to reach out personally

I'm building this to help founders to grow on Reddit without feeling spammy or inauthentic, but I can only make it better if I know what's working and what's not

Would you mind sharing some quick feedback about it? Even a couple of words helps a ton!!

Thanks for giving Reddinbox a shot <3

Nicolas
Founder, Reddinbox
`;
};
