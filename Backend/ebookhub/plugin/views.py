from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Plugin
from .serializers import PluginSerializer

class PluginList(APIView):
    def get(self, request):
        plugins = Plugin.objects.all()
        serializer = PluginSerializer(plugins, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PluginToggle(APIView):
    def patch(self, request, pk):
        try:
            plugin = Plugin.objects.get(pk=pk)
        except Plugin.DoesNotExist:
            return Response({"detail": "Plugin not found."}, status=status.HTTP_404_NOT_FOUND)

        is_active = request.data.get("is_active", None)
        if is_active is not None:
            plugin.is_active = is_active
            plugin.save()
            return Response(PluginSerializer(plugin).data, status=status.HTTP_200_OK)

        return Response({"detail": "is_active field not provided."}, status=status.HTTP_400_BAD_REQUEST)
