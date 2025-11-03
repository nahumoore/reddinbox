import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { postBuilderGenerationStore } from "@/stores/post-builder-generation";
import { IconArrowRight, IconInfoCircle } from "@tabler/icons-react";

interface PostConfigurationStepProps {
  onNext: () => void;
}

export default function PostConfigurationStep({
  onNext,
}: PostConfigurationStepProps) {
  const { config, setConfig } = postBuilderGenerationStore();

  const isValid = config.subreddit.trim() !== "";

  const handleSubredditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, subreddit: e.target.value });
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">
          Configure Your Post
        </CardTitle>
        <CardDescription className="text-base">
          Tell us your story and where you want to share it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Context Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
                What do you want to share?
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <IconInfoCircle className="h-4 w-4" />
                      <span className="sr-only">Show examples</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="start">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium font-heading mb-2">
                          Story Ideas
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• What did you accomplish today?</li>
                          <li>
                            • Did you reach a milestone you want to celebrate?
                          </li>
                          <li>
                            • What lesson or insight did you learn recently?
                          </li>
                          <li>
                            • Have you overcome a challenge you want to share?
                          </li>
                          <li>
                            • What project are you working on that others might
                            find interesting?
                          </li>
                        </ul>
                      </div>
                      <Separator />
                      <div className="text-xs text-muted-foreground">
                        <strong className="text-foreground">Pro tip:</strong> Be
                        specific and authentic. Include numbers, emotions, and
                        concrete examples.
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </h3>
              <p className="text-sm text-muted-foreground">
                Tell us about your story, achievement, or insight. We&apos;ll
                craft it into an engaging Reddit post.
              </p>
            </div>
            <Textarea
              id="story"
              placeholder={`I'm sick of "what are you working" posts and people thinking they'll get leads from there. It's waaay better to be helpful first and then ONLY outreach if the user it's looking for something you offer.`}
              value={config.story}
              onChange={(e) => setConfig({ ...config, story: e.target.value })}
              rows={8}
              className="resize-none text-base"
            />
          </div>

          {/* Subreddit Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-semibold">
                Target Subreddit
              </h3>
              <p className="text-sm text-muted-foreground">
                Which subreddit do you want to post in?
              </p>
            </div>
            <Input
              id="subreddit"
              placeholder="e.g., webdev, entrepreneur, SaaS"
              value={config.subreddit}
              onChange={handleSubredditChange}
              className="max-w-md"
            />
          </div>

          {/* Action Section */}
          <div className="flex justify-end">
            <Button onClick={handleNext} disabled={!isValid} size="lg">
              Next Step
              <IconArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
