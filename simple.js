{
  "nodes": [
    { "type": "schedule_trigger", "config": { "cron": "0 9 * * *" } },
    { "type": "x_api", "config": { "action": "search_tweets", "query": "#automation" } },
    { "type": "gpt", "config": { "prompt": "Create LinkedIn and Instagram post based on X data" } },
    { "type": "image_generator", "config": { "prompt": "Create relevant visual" } },
    { "type": "linkedin", "config": { "action": "create_post", "content": "{{gpt.output}}" } },
    { "type": "instagram", "config": { "action": "publish_post", "image": "{{image_generator.output}}", "caption": "{{gpt.output}}" } }
  ]
}
