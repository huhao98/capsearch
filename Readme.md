### Required Environment Variables:

- `ALGOLIA_APP_ID` : App id
- `ALGOLIA_API_KEY` : Api key
- `ALGOLIA_INDEX` : Name of the index

### Command line options

Example: 

```
capsearch <SRT_FILE> --uri <VideoID> 
```

- `--uri`: Video identifier
- `--group`: Number of lines to be grouped as one caption
- `--overlap`: Number of lines overlapped between groups
- `--output` : Dry run and write he records to the output json file.
- `--encoding`: SRT file encodie
  