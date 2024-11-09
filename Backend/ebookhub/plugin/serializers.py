from rest_framework import serializers
from .models import Plugin

class PluginSerializer(serializers.ModelSerializer):
    tags = serializers.StringRelatedField(many=True)

    class Meta:
        model = Plugin
        fields = ['id', 'title', 'description', 'created_at', 'tags', 'is_active']