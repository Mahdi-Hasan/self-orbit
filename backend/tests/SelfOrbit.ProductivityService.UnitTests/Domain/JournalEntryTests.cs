using Xunit;
using FluentAssertions;
using SelfOrbit.ProductivityService.Domain.Aggregates;

namespace SelfOrbit.ProductivityService.UnitTests.Domain;

public class JournalEntryTests
{
    [Fact]
    public void CreateText_ShouldCreateTextEntry()
    {
        var entry = JournalEntry.CreateText("Today was a great day");

        entry.RawText.Should().Be("Today was a great day");
        entry.EntryType.Should().Be(JournalEntryType.Text);
    }

    [Fact]
    public void CreateText_EmptyText_ShouldThrow()
    {
        var act = () => JournalEntry.CreateText("");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void CreateAudio_ShouldCreateAudioEntry()
    {
        var entry = JournalEntry.CreateAudio("https://storage/audio.wav", 120);

        entry.AudioUrl.Should().Be("https://storage/audio.wav");
        entry.AudioDurationSeconds.Should().Be(120);
        entry.EntryType.Should().Be(JournalEntryType.Audio);
    }

    [Fact]
    public void SetSummary_ShouldUpdateFields()
    {
        var entry = JournalEntry.CreateText("Had a productive day");
        entry.SetSummary("Productive day summary", "positive", ["work", "productivity"]);

        entry.Summary.Should().Be("Productive day summary");
        entry.Mood.Should().Be("positive");
        entry.KeyTopics.Should().Contain("work");
    }

    [Fact]
    public void GetFullText_TextEntry_ShouldReturnRawText()
    {
        var entry = JournalEntry.CreateText("Hello world");
        entry.GetFullText().Should().Be("Hello world");
    }

    [Fact]
    public void GetFullText_AudioEntry_WithTranscription_ShouldReturnTranscribed()
    {
        var entry = JournalEntry.CreateAudio("url", 60);
        entry.SetTranscription("Transcribed text here");

        entry.GetFullText().Should().Be("Transcribed text here");
    }
}
