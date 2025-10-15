interface FeedbackRequestEmailParams {
  first_name: string;
}

export const feedbackRequestEmailTemplate = ({
  first_name,
}: FeedbackRequestEmailParams): string => {
  return `Hey ${first_name},

Nicolas here, founder of Reddinbox.

I noticed you recently started using the platform and I wanted to reach out personally.

I'm building this platform to help founders like us grow on Reddit without feeling spammy or inauthentic. But I can only make it better if I know what's working and what's not.

Would you mind sharing some quick feedback? Something like:

- What brought you to Reddinbox?
- Have you hit any friction points or confusing parts?
- What feature would make this a no-brainer tool for you?

No pressure to answer them all, even a couple of words helps a ton. Just hit reply and let me know what you think.

Thanks for giving Reddinbox a shot.

Nicolas
Founder, Reddinbox
`;
};
