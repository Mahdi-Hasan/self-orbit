using SelfOrbit.BuildingBlocks.Domain;

namespace SelfOrbit.ProductivityService.Domain.Aggregates;

/// <summary>
/// JournalEntry aggregate root — audio/text journal entries with AI summarization.
/// </summary>
public class JournalEntry : AggregateRoot
{
    public string? RawText { get; private set; }
    public string? TranscribedText { get; private set; }
    public string? Summary { get; private set; }
    public string? Mood { get; private set; }
    public List<string> KeyTopics { get; private set; } = [];
    public JournalEntryType EntryType { get; private set; }
    public string? AudioUrl { get; private set; }
    public int? AudioDurationSeconds { get; private set; }

    private JournalEntry() { }

    public static JournalEntry CreateText(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentException("Text is required.", nameof(text));

        return new JournalEntry
        {
            RawText = text,
            EntryType = JournalEntryType.Text
        };
    }

    public static JournalEntry CreateAudio(string audioUrl, int durationSeconds)
    {
        return new JournalEntry
        {
            AudioUrl = audioUrl,
            AudioDurationSeconds = durationSeconds,
            EntryType = JournalEntryType.Audio
        };
    }

    public void SetTranscription(string transcribedText)
    {
        TranscribedText = transcribedText;
    }

    public void SetSummary(string summary, string mood, List<string> keyTopics)
    {
        Summary = summary;
        Mood = mood;
        KeyTopics = keyTopics;
    }

    public string GetFullText() => TranscribedText ?? RawText ?? string.Empty;
}

public enum JournalEntryType { Text = 0, Audio = 1 }
